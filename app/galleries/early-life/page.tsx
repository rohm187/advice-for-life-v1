import { PhotoGallery } from '@/components/photo-gallery';

export const metadata = {
  title: 'Early Life | Advice for Life',
  description: 'Brandon early childhood',
};

export default function EarlyLifeGallery() {
  const photos = [
    { filename: '04_childhood.jpg', caption: 'Early Life' },
    { filename: '06_early_years.jpg', caption: 'Early Life' },
    { filename: '07_innocence.jpg', caption: 'Early Life' },
    { filename: '514055160_10237957658902278_6130412899037950373_n.jpg', caption: 'Early Life' },
    { filename: '514192695_10237957660822326_4908455754349295579_n.jpg', caption: 'Early Life' },
  ];

  return (
    <PhotoGallery
      title="Early Life"
      subtitle="Before any of this"
      photos={photos}
      galleryPath="early_life"
    />
  );
}
