import React, { useState, useCallback } from "react"
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import API from '../api/apigClient';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, Box } from "@material-ui/core";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const Input = styled('input')({
  display: 'none',
});

function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
  }

export default function UploadButtons(props) {
    const [fileNames, setFileNames] = useState({
        loading : false,
        data : []
    })
    const [openModal, setOpenModal] = useState(false);
    const [snackBar, setSnackBar] = useState(null);

    const handleUpload = async (event) => {
        setSnackBar(null);
        var images = []
    
        for (let file of event.target.files) {
            images.push({
                file : URL.createObjectURL(file),
                name : file.name,
                customLabel : '',
                type : file.type,
                size : file.size,
                formData : await file.arrayBuffer()
            });
            
        }
        if (images.length > 0){
            setFileNames({
                ...fileNames,
                data : images
            });
            setOpenModal(true);
        }
      }
    const handleModalClose = () => {
        setOpenModal(false);
    };
    const handleSnackBarClose = () => {
        setSnackBar(null);
    }

    const handleFileUploads = () => {
        for (let file of fileNames.data){
            const objectPath = file.name.replace(' ', '-');
            console.log(file);
            API.put(`/upload/ccbd-photo-album/images/${objectPath}`, 
                file.formData,
                {
                    headers : {
                        'Content-Type': file.type,
                        'x-api-key' : process.env.REACT_APP_API_KEY,
                        'x-amz-meta-customLabels' : file.customLabel
                    }
                },)
            .then(res => {
                console.log('uploaded successfully');
                setOpenModal(false);
                setSnackBar('success');
            }).catch(err => {
                console.log(err);
                setSnackBar('error')
            })
        }
    }
    
    return (
        <>
        <Stack direction="row" alignItems="center" spacing={2}>
        <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={handleUpload}/>
            <Button variant="outlined" component="span">
            UploadButton
            </Button>
        </label>
        <Dialog open={openModal && fileNames.data.length > 0} onClose={handleModalClose}>
            <DialogTitle>Upload Images</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Add custom labels to images
                </DialogContentText>
                <Grid container spacing={2}>
                {fileNames.data.map((each, idx) => {   
                    console.log(each); 
                    return (
                    <div key={idx} style={{display: 'flex', width: '100%'}} >
                        <Grid item >
                            <Box sx={{width : 100, height : 100, margin: '12px'}}>
                            <img src={`${each.file}`} width={'100%'} height={'100%'} style={{ objectFit: 'cover'}}/>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                type="email"
                                value={each.customLabel}
                                onChange={(e) => {
                                    const newFiles = Object.assign([...fileNames.data], {
                                        [idx] : {
                                            ...each,
                                            customLabel : e.target.value
                                        }
                                    })
                                    setFileNames({
                                        ...fileNames,
                                        data : newFiles
                                    });
                                }}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                    </div>
                    )
                })}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleModalClose}>Cancel</Button>
                <Button onClick={handleFileUploads}>Upload</Button>
            </DialogActions>
            </Dialog>
        </Stack>
        <Stack spacing={2} sx={{ width: '100%' }}>
            {snackBar === 'success' ? 
                (<Snackbar open={snackBar} 
                    autoHideDuration={6000} 
                    TransitionComponent={TransitionUp}
                    anchorOrigin={{ vertical : 'bottom', horizontal : 'center'}}
                    onClose={handleSnackBarClose}>
                    <Alert onClose={handleSnackBarClose} severity="success" sx={{ width: '100%' }}>
                    Successfully uploaded {fileNames.data.length} images!
                    </Alert>
                </Snackbar>)
            : (snackBar === 'error' && (
                <Snackbar open={snackBar} 
                    autoHideDuration={6000} 
                    TransitionComponent={TransitionUp}
                    anchorOrigin={{ vertical : 'bottom', horizontal : 'center'}}
                    onClose={handleSnackBarClose}>
                    <Alert onClose={handleSnackBarClose} severity="error" sx={{ width: '100%' }}>
                    Error uploading image(s)
                    </Alert>
                </Snackbar>
                )
            )
            }
            
        </Stack>
        </>
  );
}


function FormDialog(props) {
    const { open, setOpen } = props;
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleModalClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          Open form dialog
        </Button>
        
      </div>
    );
  }