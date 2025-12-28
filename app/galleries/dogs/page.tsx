import { PhotoGallery } from '@/components/photo-gallery';

export const metadata = {
  title: 'Kahlúa & Angel - The Dogs | Advice for Life',
  description: 'The dogs who were there through it all',
};

export default function DogsGallery() {
  const photos = [
    { filename: '00_angel_on_grass.jpg', caption: 'Dogs' },
    { filename: '00_kahlua_with_toy.jpg', caption: 'Dogs' },
    { filename: '01_dog_photo.jpg', caption: 'Dogs' },
    { filename: '02_kahlua_or_angel.jpg', caption: 'Dogs' },
    { filename: '03_dog_closeup.jpg', caption: 'Dogs' },
    { filename: '04_dog_outdoor.jpg', caption: 'Dogs' },
    { filename: '05_puppy.jpg', caption: 'Dogs' },
    { filename: '06_dog_bed.jpg', caption: 'Dogs' },
    { filename: '07_dog_happy.jpg', caption: 'Dogs' },
    { filename: '08_puppy_sleeping.jpg', caption: 'Dogs' },
    { filename: '09_dog_portrait.jpg', caption: 'Dogs' },
    { filename: '10_dog_with_hat.jpg', caption: 'Dogs' },
    { filename: '11_puppy_with_ball.jpg', caption: 'Dogs' },
    { filename: '12_dog_night.jpg', caption: 'Dogs' },
  ];

  return (
    <PhotoGallery
      title="Kahlúa & Angel"
      subtitle="The dogs who were there through it all"
      photos={photos}
      galleryPath="dogs"
    />
  );
}
