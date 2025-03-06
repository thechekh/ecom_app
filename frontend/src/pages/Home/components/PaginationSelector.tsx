import { memo } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';

interface PaginationSelectorProps {
    value: 'page' | 'infinite';
    onChange: (event: SelectChangeEvent<string>) => void;
}

const PaginationSelector = memo(({ value, onChange }: PaginationSelectorProps) => (
    <FormControl fullWidth>
        <InputLabel>Pagination Type</InputLabel>
        <Select
            value={value}
            label="Pagination Type"
            onChange={onChange}
        >
            <MenuItem value="page">Page-based</MenuItem>
            <MenuItem value="infinite">Infinite Scroll</MenuItem>
        </Select>
    </FormControl>
));

PaginationSelector.displayName = 'PaginationSelector';

export default PaginationSelector; 