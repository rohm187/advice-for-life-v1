import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('Phoenix2025!', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'brandon@adviceforlife.com' },
    update: {
      password: hashedPassword,
      role: 'admin',
    },
    create: {
      email: 'brandon@adviceforlife.com',
      name: 'Brandon Rohm',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('✅ Created admin user:', admin.email)

  // Sample businesses to showcase the tracker
  const businesses = [
    {
      name: 'Advice for Life Publishing',
      description: 'Self-publishing platform for raw, authentic life stories and lessons from rock bottom.',
      launchDate: new Date('2024-01-15'),
      status: 'active',
      category: 'Publishing',
      milestone: 'First book launched',
    },
    {
      name: 'Phoenix Rising Consulting',
      description: 'Life coaching and business consulting for people rebuilding from rock bottom.',
      launchDate: new Date('2024-02-20'),
      status: 'active',
      category: 'Consulting',
      milestone: '10+ clients served',
    },
    {
      name: 'Stoic Daily Journal',
      description: 'Digital journaling app focused on Stoic philosophy and daily reflection practices.',
      launchDate: new Date('2024-03-10'),
      status: 'active',
      category: 'SaaS',
      milestone: 'Beta launch',
    },
    {
      name: 'Rock Bottom Recovery Community',
      description: 'Online community and support group for people in recovery and rebuilding their lives.',
      launchDate: new Date('2024-04-05'),
      status: 'active',
      category: 'Community',
      milestone: '500+ members',
    },
    {
      name: '100 Businesses Course',
      description: 'Online course teaching the framework for building multiple businesses from scratch.',
      launchDate: new Date('2024-05-15'),
      status: 'active',
      category: 'Education',
      milestone: 'Course outline complete',
    },
  ]

  for (const business of businesses) {
    await prisma.business.upsert({
      where: { id: business.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        ...business,
        userId: admin.id,
      },
    })
  }

  console.log(`✅ Created ${businesses.length} sample businesses`)
  console.log('🎉 Seed completed!')
  console.log('\n📝 Admin Credentials:')
  console.log('   Email: brandon@adviceforlife.com')
  console.log('   Password: Phoenix2025!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
