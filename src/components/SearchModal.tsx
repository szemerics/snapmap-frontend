import { useMediaQuery } from "@/hooks/use-media-query"
import { type Dispatch, type SetStateAction } from "react"
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "./ui/drawer"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "./ui/combobox"
import { Button } from "./ui/button"
import { CAMERA_BRANDS, CAMERA_TYPES } from "@/constants/photoOptions"

export type SearchFilters = {
  username?: string
  date_captured_from?: string
  date_captured_to?: string
  camera_brand?: string
  camera_model?: string
  camera_type?: string
  lens?: string
  iso?: number
  shutter_speed?: string
  aperture?: string
}

interface SearchDialogProps {
  isSearchDialogOpen: boolean
  setIsSearchDialogOpen: Dispatch<SetStateAction<boolean>>
  filters: SearchFilters
  handleInputChange: (key: keyof SearchFilters, value: string) => void
  handleDateChange: (key: keyof SearchFilters, value: string) => void
  handleSearch: () => void
  handleClear: () => void
}

const SearchDialog = ({
  isSearchDialogOpen,
  setIsSearchDialogOpen,
  filters,
  handleInputChange,
  handleDateChange,
  handleSearch,
  handleClear,
}: SearchDialogProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  const onSearchClick = () => {
    handleSearch()
    setIsSearchDialogOpen(false)
  }

  const onClearClick = () => {
    handleClear()
  }

  return (
    <>
      {isMobile ? (
        <Drawer open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen} direction="bottom">
          <DrawerContent className="max-h-screen!">
            <div className="w-full flex justify-center items-center">
              <DrawerTitle className="my-5 text-sm">Filters</DrawerTitle>
              <DrawerDescription className="sr-only">Search filters</DrawerDescription>
            </div>
            <div className="overflow-y-auto px-6 py-4">
              <SearchForm
                filters={filters}
                handleInputChange={handleInputChange}
                handleDateChange={handleDateChange}
                handleSearch={onSearchClick}
                handleClear={onClearClick}
              />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
          <DialogContent className="sm:max-w-md w-full">
            <div className="w-full flex justify-center items-center">
              <DialogHeader className="items-center">
                <DialogTitle className="my-2 text-sm">Filters</DialogTitle>
                <DrawerDescription className="sr-only">Search filters</DrawerDescription>
              </DialogHeader>
            </div>
            <div className="overflow-y-auto max-h-[70vh] px-1 py-2">
              <SearchForm
                filters={filters}
                handleInputChange={handleInputChange}
                handleDateChange={handleDateChange}
                handleSearch={onSearchClick}
                handleClear={onClearClick}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

const SearchForm = ({
  filters,
  handleInputChange,
  handleDateChange,
  handleSearch,
  handleClear,
}: {
  filters: SearchFilters
  handleInputChange: (key: keyof SearchFilters, value: string) => void
  handleDateChange: (key: keyof SearchFilters, value: string) => void
  handleSearch: () => void
  handleClear: () => void
}) => {
  return (
    <div className="mb-6 space-y-6">
      <FieldGroup className="px-2">
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input
            placeholder="Enter username"
            value={filters.username ?? ""}
            onChange={(e) => handleInputChange("username", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel>Date captured from</FieldLabel>
            <Input
              type="date"
              value={filters.date_captured_from ?? ""}
              onChange={(e) => handleDateChange("date_captured_from", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Date captured to</FieldLabel>
            <Input
              type="date"
              value={filters.date_captured_to ?? ""}
              onChange={(e) => handleDateChange("date_captured_to", e.target.value)}
            />
          </Field>
        </div>

        <SearchSelect
          label="Camera brand"
          value={filters.camera_brand ?? ""}
          onChange={(val) => handleInputChange("camera_brand", val)}
          options={CAMERA_BRANDS}
          placeholder="Select camera brand"
        />

        <Field>
          <FieldLabel>Camera model</FieldLabel>
          <Input
            placeholder="Z6 II"
            value={filters.camera_model ?? ""}
            onChange={(e) => handleInputChange("camera_model", e.target.value)}
          />
        </Field>

        <SearchSelect
          label="Camera type"
          value={filters.camera_type ?? ""}
          onChange={(val) => handleInputChange("camera_type", val)}
          options={CAMERA_TYPES}
          placeholder="Select camera type"
        />

        <Field>
          <FieldLabel>Lens</FieldLabel>
          <Input
            placeholder="Nikkor 50mm f/1.8"
            value={filters.lens ?? ""}
            onChange={(e) => handleInputChange("lens", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field>
            <FieldLabel>ISO</FieldLabel>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="100"
              value={filters.iso?.toString() ?? ""}
              onChange={(e) => handleInputChange("iso", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Shutter speed</FieldLabel>
            <Input
              placeholder="1/125"
              value={filters.shutter_speed ?? ""}
              onChange={(e) => handleInputChange("shutter_speed", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Aperture</FieldLabel>
            <Input
              placeholder="f/2.8"
              value={filters.aperture ?? ""}
              onChange={(e) => handleInputChange("aperture", e.target.value)}
            />
          </Field>
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <Button className="w-1/2" variant="outline" type="button" onClick={handleClear}>
            Clear filters
          </Button>
          <Button className="w-1/2" type="button" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </FieldGroup>
    </div>
  )
}

const SearchSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder: string
}) => {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Combobox
        items={options}
        value={value}
        onValueChange={(val) => {
          onChange(val ?? "")
        }}
      >
        <ComboboxInput placeholder={placeholder} />
        <ComboboxContent className="max-h-80!">
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item} className="mb-2 pointer-events-auto">
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}

export default SearchDialog
