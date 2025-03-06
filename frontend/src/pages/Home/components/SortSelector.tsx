import { memo } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';

interface SortSelectorProps {
    value: string;
    onChange: (event: SelectChangeEvent<string>) => void;
}

const SortSelector = memo(({ value, onChange }: SortSelectorProps) => (
    <FormControl fullWidth>
        <InputLabel>Sort By</InputLabel>
        <Select
            value={value}
            label="Sort By"
            onChange={onChange}
        >
            <MenuItem value="-created_at">Date (Newest First)</MenuItem>
            <MenuItem value="created_at">Date (Oldest First)</MenuItem>
            <MenuItem value="price">Price (Low to High)</MenuItem>
            <MenuItem value="-price">Price (High to Low)</MenuItem>
        </Select>
    </FormControl>
));

SortSelector.displayName = 'SortSelector';

export default SortSelector; 