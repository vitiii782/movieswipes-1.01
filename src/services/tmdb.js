import axios from 'axios';

const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; // Standard TMDb API Key for demo purposes, usually should be in .env
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});



export const tmdbService = {
  getMovies: async (page = 1, filters = {}, type = 'movie') => {
    try {
      let endpoint = `/discover/${type}`;
      let params = {
        language: 'en-US',
        page,
        sort_by: 'vote_average.desc',
        'vote_average.gte': filters.minRating ?? 6.0,
        'vote_count.gte': filters.minVoteCount ?? 100,
        with_genres: filters.genreId || '',
        without_genres: filters.withoutGenres || '',
        with_original_language: 'en|ja|ko|fr|es|de|it',
        with_keywords: filters.keywords || '',
        certification_country: filters.certificationCountry || '',
        'certification.gte': filters.certificationGte || '',
        certification: filters.certification || '',
        ...(type === 'movie'
          ? {
            'primary_release_date.gte': filters.releaseDateGte || '',
            primary_release_year: filters.year || '',
          }
          : { first_air_date_year: filters.year || '' }),
      };

      const response = await tmdbApi.get(endpoint, { params });

      let results = (response.data.results || []).map(item => ({
        id: item.id || Math.random(),
        title: item.title || item.name || 'Unknown Title',
        poster: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
        rating: Number(item.vote_average) || 0,
        year: (item.release_date || item.first_air_date) ? new Date(item.release_date || item.first_air_date).getFullYear() : 'N/A',
        releaseDate: item.release_date || item.first_air_date || '',
        description: item.overview || '',
        mediaType: type,
      }));

      // Client-side safety net: for upcoming, strip anything already released
      if (filters.upcoming) {
        const now = new Date();
        results = results.filter(m => m.releaseDate && new Date(m.releaseDate) > now);
      }

      return {
        results,
        totalPages: response.data.total_pages || 1
      };
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return { results: [], totalPages: 0 };
    }
  },

  getMovieDetails: async (id, type = 'movie') => {
    try {
      const [details, watchProviders, videos] = await Promise.all([
        tmdbApi.get(`/${type}/${id}`),
        tmdbApi.get(`/${type}/${id}/watch/providers`),
        tmdbApi.get(`/${type}/${id}/videos`),
      ]);

      const trailer = videos.data.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      const trailerKey = trailer?.key || videos.data.results?.[0]?.key;

      const region = 'DE'; // Default to DE for now
      const providersData = watchProviders.data.results?.[region] || {};

      const allProviders = [
        ...(providersData.flatrate || []),
        ...(providersData.rent || []),
        ...(providersData.buy || []),
      ].filter(p => p && p.provider_id);

      // Remove duplicates by provider_id
      const uniqueProviders = Array.from(new Map(allProviders.map(p => [p.provider_id, p])).values());

      const providers = uniqueProviders.map(p => ({
        name: p.provider_name || 'Provider',
        logo: p.logo_path ? `${IMAGE_BASE_URL}${p.logo_path}` : null
      }));

      const data = details.data || {};

      return {
        ...data,
        id: data.id,
        title: data.title || data.name || 'Unknown',
        rating: Number(data.vote_average) || 0,
        runtime: data.runtime || (data.episode_run_time ? data.episode_run_time[0] : null),
        genres: (data.genres || []).map(g => g.name).filter(Boolean),
        watchProviders: providers,
        mediaType: type,
        seasons: data.number_of_seasons || null,
        episodes: data.number_of_episodes || null,
        overview: data.overview || '',
        poster: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : null,
        trailerKey,
      };
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
      return null;
    }
  },

  getGenres: async (type = 'movie') => {
    try {
      const response = await tmdbApi.get(`/genre/${type}/list`);
      return response.data.genres;
    } catch (error) {
      console.error(`Error fetching ${type} genres:`, error);
      return [];
    }
  },

  searchMovies: async (query, type = 'movie') => {
    try {
      const response = await tmdbApi.get(`/search/${type}`, {
        params: { query, language: 'en-US' }
      });

      return (response.data.results || []).map(item => ({
        id: item.id,
        title: item.title || item.name || 'Unknown Title',
        poster: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
        rating: Number(item.vote_average) || 0,
        year: (item.release_date || item.first_air_date) ? new Date(item.release_date || item.first_air_date).getFullYear() : 'N/A',
        description: item.overview || '',
        mediaType: type,
      }));
    } catch (error) {
      console.error(`Error searching ${type}:`, error);
      return [];
    }
  }
};
