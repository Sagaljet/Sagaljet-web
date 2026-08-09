"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
];

export function ComboboxForm() {
  const [selectedLanguage, setSelectedLanguage] = useState("");

  function onSubmit(event: any) {
    event.preventDefault();

    if (!selectedLanguage) {
      alert("Please select a language.");
      return;
    }

    toast("You submitted the following values:");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col">
        <label>Language</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[200px] justify-between",
                !selectedLanguage && "text-muted-foreground"
              )}
            >
              {selectedLanguage
                ? languages.find(
                    (language) => language.value === selectedLanguage
                  )?.label
                : "Select language"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search language..." />
              <CommandList>
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup>
                  {languages.map((language) => (
                    <CommandItem
                      value={language.label}
                      key={language.value}
                      onSelect={() => setSelectedLanguage(language.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          language.value === selectedLanguage
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {language.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <p className="text-sm text-gray-500">
          This is the language that will be used in the dashboard.
        </p>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
