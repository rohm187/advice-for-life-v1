import { PhotoGallery } from '@/components/photo-gallery';

export const metadata = {
  title: 'California | Advice for Life',
  description: 'Brandon in California - early years',
};

export default function CaliforniaGallery() {
  const photos = [
    { filename: '01_grandmother_california.jpg', caption: 'California' },
    { filename: '01_phoenix_rise.jpg', caption: 'California' },
    { filename: '02_toddler.jpg', caption: 'California' },
    { filename: '05_building_life.jpg', caption: 'California' },
    { filename: '08_outdoors.jpg', caption: 'California' },
    { filename: '09_childhood_photo.jpg', caption: 'California' },
    { filename: '12_rising_up.jpg', caption: 'California' },
    { filename: '505128734_10234475606804133_8865417924200134155_n.jpg', caption: 'California' },
  ];

  return (
    <PhotoGallery
      title="California"
      subtitle="Early years in California"
      photos={photos}
      galleryPath="california"
    />
  );
}
