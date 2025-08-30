export const galleryQuery = `*[_type == "galleryItem"] | order(_createdAt desc) {
  _id,
  title,
  description,
  mediaType,
  "imageUrl": image.asset->url,
  "imageBlur": image.asset->metadata.lqip,
  "videoUrl": video.asset->url
}`;
export const options = { next: { revalidate: 10 } };
