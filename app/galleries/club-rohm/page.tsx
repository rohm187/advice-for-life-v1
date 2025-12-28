import { PhotoGallery } from '@/components/photo-gallery';

export const metadata = {
  title: 'Club Rohm | Advice for Life',
  description: 'The house that almost killed me',
};

export default function ClubRohmGallery() {
  const photos = [
    { filename: '00_brandon_age_23_club_rohm.jpg', caption: 'Club Rohm' },
    { filename: '01_baby_photo.jpg', caption: 'Club Rohm' },
    { filename: '01_party_group.jpg', caption: 'Club Rohm' },
    { filename: '02_new_beginning.jpg', caption: 'Club Rohm' },
    { filename: '02_party_scene.jpg', caption: 'Club Rohm' },
    { filename: '03_party_friends.jpg', caption: 'Club Rohm' },
    { filename: '04_party_night.jpg', caption: 'Club Rohm' },
    { filename: '05_club_scene.jpg', caption: 'Club Rohm' },
    { filename: '06_party_crew.jpg', caption: 'Club Rohm' },
    { filename: '07_group_photo.jpg', caption: 'Club Rohm' },
    { filename: '08_club_night.jpg', caption: 'Club Rohm' },
    { filename: '09_party_fun.jpg', caption: 'Club Rohm' },
    { filename: '10_blue_shirt_party.jpg', caption: 'Club Rohm' },
    { filename: '11_big_group.jpg', caption: 'Club Rohm' },
    { filename: '511037901_10234755108071490_5862975021709205814_n.jpg', caption: 'Club Rohm' },
    { filename: 'jay_and_john_nash_together.jpg', caption: 'Club Rohm' },
    { filename: 'jay_yedlowski_memorial.jpg', caption: 'Club Rohm' },
  ];

  return (
    <PhotoGallery
      title="Club Rohm"
      subtitle="The house that almost killed me"
      photos={photos}
      galleryPath="club_rohm"
    />
  );
}
