import { groq } from "next-sanity";

export const artworkFields = groq`
  _id,
  title,
  slug,
  mainImage { ..., asset-> },
  medium,
  dimensions,
  year,
  category->{ title, slug },
  description,
  featured,
  forSale,
  price,
  sold
`;

export const allArtworksQuery = groq`
  *[_type == "artwork"] | order(_createdAt desc) {
    ${artworkFields}
  }
`;

export const featuredArtworksQuery = groq`
  *[_type == "artwork" && featured == true] | order(_createdAt desc) {
    ${artworkFields}
  }
`;

export const artworkBySlugQuery = groq`
  *[_type == "artwork" && slug.current == $slug][0] {
    ${artworkFields}
  }
`;

export const artworksByCategoryQuery = groq`
  *[_type == "artwork" && category->slug.current == $category] | order(_createdAt desc) {
    ${artworkFields}
  }
`;

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id, title, slug, description
  }
`;
