import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { readFile } from 'fs/promises'
import path from 'path'
import archiver from 'archiver'
import { Readable } from 'stream'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request?.url ?? '')
    const token = searchParams?.get?.('token') ?? ''

    if (!token) {
      return NextResponse.json(
        { error: 'Download token is required' },
        { status: 400 }
      )
    }

    // Fetch download link from database
    const downloadLink = await prisma?.downloadLink?.findUnique?.({
      where: { token },
      include: { order: true },
    })

    if (!downloadLink) {
      return NextResponse.json(
        { error: 'Invalid or expired download link' },
        { status: 404 }
      )
    }

    // Check if link has expired
    if (new Date() > new Date(downloadLink?.expiresAt ?? 0)) {
      return NextResponse.json(
        { error: 'Download link has expired' },
        { status: 410 }
      )
    }

    // Check download limit
    if ((downloadLink?.downloads ?? 0) >= (downloadLink?.maxDownloads ?? 3)) {
      return NextResponse.json(
        { error: 'Download limit reached' },
        { status: 403 }
      )
    }

    // Increment download count
    await prisma?.downloadLink?.update?.({
      where: { id: downloadLink?.id },
      data: { downloads: (downloadLink?.downloads ?? 0) + 1 },
    })

    // Determine what to serve based on product type
    const productType = downloadLink?.order?.productType ?? 'pdf'
    const publicDir = path?.join?.(process?.cwd?.() ?? '', 'public')

    if (productType === 'audiobook' || productType === 'bundle') {
      // For audiobook/bundle, create a ZIP with audiobook + bonus + PDF
      const audiobookPath = path?.join?.(publicDir, 'advice-for-life-audiobook-complete.mp3')
      const bonusPath = path?.join?.(publicDir, 'BONUS_Raw_Rant_Brandon_Rohm_30min.mp3')
      const pdfPath = path?.join?.(publicDir, 'advice-for-life-ebook.pdf')

      // Create ZIP archive
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      })

      // Create a stream to collect ZIP data
      const chunks: Buffer[] = []
      
      archive.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      // Add files to ZIP
      archive.file(audiobookPath, { name: 'Advice-for-Life-Audiobook-Complete.mp3' })
      archive.file(bonusPath, { name: 'BONUS-Raw-Rant-Brandon-Rohm-30min.mp3' })
      archive.file(pdfPath, { name: 'BONUS-Advice-for-Life-eBook.pdf' })

      // Finalize the archive
      await archive.finalize()

      // Wait for all chunks to be collected
      await new Promise((resolve) => archive.on('end', resolve))

      // Combine chunks into single buffer
      const zipBuffer = Buffer.concat(chunks)

      // Return the ZIP file
      return new NextResponse(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="Advice-for-Life-Complete-Package.zip"',
          'Cache-Control': 'no-store',
        },
      })
    } else {
      // For PDF and hardback, serve the PDF
      const pdfPath = path?.join?.(publicDir, 'advice-for-life-ebook.pdf')
      const fileBuffer = await readFile(pdfPath)

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Advice-for-Life-from-a-Drug-Addict.pdf"',
          'Cache-Control': 'no-store',
        },
      })
    }
  } catch (error: unknown) {
    console.error('Download error:', error)
    const message = error instanceof Error ? error?.message : 'Download failed'
    return NextResponse.json(
      { error: message ?? 'Failed to process download' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'