import { PhotoGallery } from '@/components/photo-gallery';

export const metadata = {
  title: 'In Memoriam | Advice for Life',
  description: 'The ones we lost',
};

export default function MemorialGallery() {
  const photos = [
    { filename: '01_wrestling_team.jpg', caption: 'Memorial' },
    { filename: '02_john_tavela_tie_dye_1.jpg', caption: 'Memorial' },
    { filename: '03_john_tavela_tie_dye_2.jpg', caption: 'Memorial' },
    { filename: '04_jay_and_john_nash.jpg', caption: 'Memorial' },
    { filename: '508007248_10234651800608868_2204564060743650111_n.jpg', caption: 'Memorial' },
    { filename: '518058749_10235578555177153_4071293447521781823_n.jpg', caption: 'Memorial' },
    { filename: '518252324_10235578554257130_6789945077610582346_n.jpg', caption: 'Memorial' },
    { filename: 'anthony_bourdain.jpg', caption: 'Memorial' },
    { filename: 'chester_bennington.jpg', caption: 'Memorial' },
    { filename: 'chris_farley.jpg', caption: 'Memorial' },
    { filename: 'john_tavela_memorial.jpg', caption: 'Memorial' },
    { filename: 'mac_miller.jpg', caption: 'Memorial' },
    { filename: 'tom_petty.jpg', caption: 'Memorial' },
  ];

  return (
    <PhotoGallery
      title="In Memoriam"
      subtitle="The ones we lost - gone but never forgotten"
      photos={photos}
      galleryPath="memorial"
    />
  );
}
