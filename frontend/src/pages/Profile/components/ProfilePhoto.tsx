import { memo, ChangeEvent } from 'react';
import { Box, Avatar, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

interface ProfilePhotoProps {
    previewUrl: string | null;
    profilePhoto?: string;
    onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
}

const ProfilePhoto = memo(({ previewUrl, profilePhoto, onImageChange, loading }: ProfilePhotoProps) => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box sx={{ position: 'relative' }}>
            <Avatar
                src={previewUrl || profilePhoto}
                sx={{ width: 100, height: 100 }}
            />
            <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{
                    position: 'absolute',
                    bottom: -10,
                    right: -10,
                    backgroundColor: 'white',
                }}
            >
                <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={onImageChange}
                    disabled={loading}
                />
                <PhotoCamera />
            </IconButton>
        </Box>
    </Box>
));

ProfilePhoto.displayName = 'ProfilePhoto';

export default ProfilePhoto; 