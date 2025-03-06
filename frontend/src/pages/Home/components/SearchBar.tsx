import { memo } from 'react';
import { TextField } from '@mui/material';

interface SearchBarProps {
    onSearch: (value: string) => void;
}

const SearchBar = memo(({ onSearch }: SearchBarProps) => (
    <TextField
        fullWidth
        label="Search posts"
        variant="outlined"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by caption or username..."
    />
));

SearchBar.displayName = 'SearchBar';

export default SearchBar; 