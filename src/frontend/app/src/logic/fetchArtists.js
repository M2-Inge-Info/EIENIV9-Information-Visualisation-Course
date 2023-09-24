import axios from 'axios';


const URLS = {
    artist_all : "https://wasabi.i3s.unice.fr/api/v1/artist_all/72000"
}

export const fetchArtists = async (offset, limit) => {
  try {
    const response = await axios.get(`https://wasabi.i3s.unice.fr/api/v1/artist_all/72000?offset=${offset}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  }
};

