type Uuid = string & { readonly __brand: unique symbol };
type MediaType = ("photo" | "video") & { readonly __brand: unique symbol };
type MediaFileType = ("photo" | "video" | "video-poster") & { readonly __brand: unique symbol };
