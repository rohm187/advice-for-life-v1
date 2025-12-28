import { PhotoGallery } from '@/components/photo-gallery';

export const metadata = {
  title: 'Stars Who Shaped Me | Advice for Life',
  description: 'Tom Petty. Mac Miller. Chester Bennington. Anthony Bourdain. Chris Farley. Artists who fought their own fires.',
};

export default function StarsGallery() {
  const photos = [
    { filename: 'tom_petty.jpg', caption: 'Tom Petty - The soundtrack to the struggle' },
    { filename: 'mac_miller.jpg', caption: 'Mac Miller - Swimming through the pain' },
    { filename: 'chester_bennington.jpg', caption: 'Chester Bennington - The voice of a generation\'s pain' },
    { filename: 'anthony_bourdain.jpg', caption: 'Anthony Bourdain - Raw, honest, gone too soon' },
    { filename: 'chris_farley.jpg', caption: 'Chris Farley - Made us laugh while he was dying inside' },
  ];

  return (
    <PhotoGallery
      title="Stars Who Shaped Me"
      subtitle="Artists who fought their own fires - and taught me how to burn"
      photos={photos}
      galleryPath="stars"
    />
  );
}
