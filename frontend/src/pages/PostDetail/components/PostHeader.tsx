import { memo } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

interface PostHeaderProps {
    onBack: () => void;
}

const PostHeader = memo(({ onBack }: PostHeaderProps) => (
    <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            bgcolor: '#ffffff'
        }}
    >
        <Toolbar sx={{ minHeight: '44px!important' }}>
            <IconButton
                edge="start"
                onClick={onBack}
                sx={{ color: '#000000' }}
            >
                <ArrowBackIcon />
            </IconButton>
        </Toolbar>
    </AppBar>
));

PostHeader.displayName = 'PostHeader';

export default PostHeader; 