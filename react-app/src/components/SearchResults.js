import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Grid, Typography } from '@material-ui/core';
import CircularProgress from '@mui/material/CircularProgress';

export default function SearchResults({itemData, loading}) {
  return (
      <>
      {!loading ? (
        <ImageList sx={{ width: '100%'}} cols={3}>
        {itemData.map((item) => (
            <ImageListItem key={item.objectKey}>
            <img
                src={`https://d2wozqpiivy78v.cloudfront.net/${item.objectKey}?w=248&fit=crop&auto=format`}
                srcSet={`https://d2wozqpiivy78v.cloudfront.net/${item.objectKey}?w=248&fit=crop&auto=format 2x`}
                alt={item.objectKey}
                loading="lazy"
            />
            <ImageListItemBar
                title={item['x-amz-meta-customLabels'] ? item['x-amz-meta-customLabels'] : 'untitled'}
                subtitle={<span>Created: {item.createdTimestamp}</span>}
                position="below"
            />
            </ImageListItem>
        ))}
        </ImageList>
      ) : (
        <Grid item xs={12}>
            <Grid container spacing={0} direction='column' alignItems='center' justifyContent='center'>
                <Grid item xs={3}>
                    <CircularProgress />
                </Grid>
            </Grid>
        </Grid>
      )}
    </>
  );
}
