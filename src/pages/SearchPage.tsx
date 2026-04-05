import { useState } from "react"
import Post from "@/components/post/Post"
import type { IPhoto } from "@/interfaces/IPhoto"
import { photoService } from "@/services/photo.service"
import { Separator } from "@/components/ui/separator"
import { ChevronUp, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchModal, { type SearchFilters } from "@/components/SearchModal"
import { useAuthContext } from "@/context/AuthContext"
import { useMediaQuery } from "@/hooks/use-media-query"

const SearchPage = () => {
  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<IPhoto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const { currentUser } = useAuthContext()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleInputChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]:
        value === "" ? undefined : key === "iso" ? (Number.isNaN(Number(value)) ? undefined : Number(value)) : value,
    }))
  }

  const handleDateChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
  }

  const handleSearch = async () => {
    setIsLoading(true)
    setHasSearched(true)

    const params: Record<string, string | number | undefined> = {
      username: filters.username,
      date_captured_from: filters.date_captured_from,
      date_captured_to: filters.date_captured_to,
      camera_brand: filters.camera_brand,
      camera_model: filters.camera_model,
      camera_type: filters.camera_type,
      lens: filters.lens,
      iso: filters.iso,
      shutter_speed: filters.shutter_speed,
      aperture: filters.aperture,
    }

    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([k, v]) => k && v !== undefined && v !== "")
    )

    try {
      const data = await photoService.getPhotos<IPhoto[]>(cleanedParams as any)
      const filteredData = data.filter((photo) => photo.user_summary.user_id !== currentUser?.id) ?? data
      setResults(filteredData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setFilters({})
  }

  const showInitialMessage = !hasSearched
  const showNoResultsMessage = hasSearched && !isLoading && results.length === 0

  return (
    <div className="my-6 space-y-6">
      {!isMobile && (
        <Button className="w-full cursor-pointer" variant={"outline"} onClick={() => setIsSearchDialogOpen(true)}>
          <span className="text-sm font-medium">Search Posts</span>
        </Button>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-sm text-muted-foreground px-4">
          Searching photos...
        </div>
      )}

      {!isLoading && showInitialMessage && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-sm text-muted-foreground text-center px-4">
          Use the filters and press Search to find photos.
        </div>
      )}

      {!isLoading && showNoResultsMessage && (
        <div className="flex flex-col gap-3 items-center justify-center min-h-[80vh] text-sm text-muted-foreground text-center px-4">
          <SearchX size={24} />
          <span className="text-sm">No photos match these filters. Try changing them.</span>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="space-y-6">
          {results.map((photo, index) => (
            <div key={photo.id}>
              <Post
                photo={photo}
                onDelete={() => {
                  setResults((prev) => prev.filter((item) => item.id !== photo.id))
                }}
              />
              {index !== results.length - 1 ? <Separator className="my-6" /> : null}
            </div>
          ))}
        </div>
      )}

      {isMobile && (
        <Button
          className="fixed bottom-17 left-0 right-0 z-40 w-full sm:max-w-sm sm:mx-auto rounded-none border-t border-border border-x-0 border-b-0 flex flex-col gap-0 h-auto bg-card py-5"
          variant={"ghost"}
          onClick={() => setIsSearchDialogOpen(true)}
        >
          <div className="absolute -top-3.5 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted shadow-sm">
            <ChevronUp className="h-4 w-4 text-foreground/70" />
          </div>
          <span className="text-sm font-medium">Search Posts</span>
        </Button>
      )}

      <SearchModal
        isSearchDialogOpen={isSearchDialogOpen}
        setIsSearchDialogOpen={setIsSearchDialogOpen}
        filters={filters}
        handleInputChange={handleInputChange}
        handleDateChange={handleDateChange}
        handleSearch={handleSearch}
        handleClear={handleClear}
      />
    </div>
  )
}

export default SearchPage
