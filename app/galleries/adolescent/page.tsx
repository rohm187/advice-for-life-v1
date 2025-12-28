import { PhotoGallery } from '@/components/photo-gallery';

export const metadata = {
  title: 'Adolescent Years - Haven\'t Spread Wings Yet | Advice for Life',
  description: 'Teen years, first jobs, and the years before everything changed.',
};

export default function AdolescentGallery() {
  const photos = [
    { filename: '01_roofing_job.jpg', caption: 'First real job - roofing' },
    { filename: '02_teen_years.jpg', caption: 'Teen years' },
    { filename: '03_young_brandon.jpg', caption: 'Young Brandon' },
    { filename: '04_adolescent.jpg', caption: 'Before Club Rohm' },
  ];

  return (
    <PhotoGallery
      title="Adolescent Years"
      subtitle="Haven't Spread Wings Yet - The years before the fire"
      photos={photos}
      galleryPath="adolescent"
    />
  );
}
