import { PhotoGallery } from '@/components/photo-gallery';

export const metadata = {
  title: 'Pittsburgh (HOME) | Advice for Life',
  description: 'Where it all went down',
};

export default function PittsburghGallery() {
  const photos = [
    { filename: '01_roofing_job.jpg', caption: 'Pittsburgh' },
    { filename: '02_teen_years.jpg', caption: 'Pittsburgh' },
    { filename: '03_young_brandon.jpg', caption: 'Pittsburgh' },
    { filename: '04_adolescent.jpg', caption: 'Pittsburgh' },
    { filename: '129874036_2772184959765549_8314098525872521666_n.jpg', caption: 'Pittsburgh' },
    { filename: '13_phoenix_strong.jpg', caption: 'Pittsburgh' },
    { filename: '17_nature.jpg', caption: 'Pittsburgh' },
    { filename: '514369349_10237957660702323_8075679169841385749_n.jpg', caption: 'Pittsburgh' },
    { filename: 'IMG_0142.JPG', caption: 'Pittsburgh' },
  ];

  return (
    <PhotoGallery
      title="Pittsburgh (HOME)"
      subtitle="Where it all went down"
      photos={photos}
      galleryPath="pittsburgh"
    />
  );
}
