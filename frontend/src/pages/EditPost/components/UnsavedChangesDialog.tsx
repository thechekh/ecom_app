import { memo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

interface UnsavedChangesDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const UnsavedChangesDialog = memo(({ open, onConfirm, onCancel }: UnsavedChangesDialogProps) => (
    <Dialog
        open={open}
        onClose={onCancel}
    >
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
            <DialogContentText>
                You have unsaved changes. Are you sure you want to leave?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel} color="primary">
                Stay
            </Button>
            <Button onClick={onConfirm} color="error">
                Leave
            </Button>
        </DialogActions>
    </Dialog>
));

UnsavedChangesDialog.displayName = 'UnsavedChangesDialog';

export default UnsavedChangesDialog; 