import { PhotoGallery } from '@/components/photo-gallery';

export const metadata = {
  title: 'The Stoics - Wisdom from the Ancients | Advice for Life',
  description: 'Marcus Aurelius. Epictetus. Seneca. Philosophy that survived 2,000 years for a reason.',
};

export default function StoicsGallery() {
  const photos = [
    { filename: 'marcus_aurelius.jpg', caption: 'Marcus Aurelius - "You have power over your mind - not outside events."' },
    { filename: 'epictetus.jpg', caption: 'Epictetus - Born a slave, died free in his mind' },
    { filename: 'seneca.jpg', caption: 'Seneca - "We suffer more often in imagination than in reality."' },
  ];

  return (
    <PhotoGallery
      title="The Stoics"
      subtitle="Wisdom from the Ancients - 2,000-year-old philosophy that still works"
      photos={photos}
      galleryPath="stoics"
    />
  );
}
