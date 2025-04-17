"use client"

import React, { useState } from "react"
import { FaAngleDown, FaCheck } from "react-icons/fa6";
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { translate } from "@/utils/helpers"

const TagSelect = ({ tagsData, defaultValue, handleTagChange }) => {
    const [open, setOpen] = useState(false)
    const [selectedValues, setSelectedValues] = useState(defaultValue?.defaultTagName?.split(',') || [])

    const handleMultiSelectChange = (value) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter(v => v !== value)
            : [...selectedValues, value]

        setSelectedValues(newValues)
        handleTagChange(newValues)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="hover:!bg-white bg-white">
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between ${selectedValues.length > 0 ? 'text-black hover:text-black' : 'text-gray-400 !font-[500] hover:text-gray-400'}`}
                >
                    {selectedValues.length > 0 ? selectedValues.join(", ") : translate('tagLbl')}
                    <FaAngleDown className="!h-3 !w-3" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full max-w-full min-w-full p-0">
                <Command className='w-full'>
                    <CommandInput placeholder="Search tags..." />
                    <CommandList>
                        <CommandEmpty>No tags found.</CommandEmpty>
                        <CommandGroup>
                            {tagsData?.map((elem) => (
                                <CommandItem
                                    key={elem?.id}
                                    value={elem?.tag_name}
                                    onSelect={() => handleMultiSelectChange(elem?.tag_name)}
                                >
                                    <FaCheck
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedValues.includes(elem?.tag_name) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {elem?.tag_name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default TagSelect
