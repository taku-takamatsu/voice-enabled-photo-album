import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { TextField } from '@material-ui/core';
import { useState, useEffect } from 'react';

export default function Search() {
    const name = 'Search...'    

    const handleChange = () => {
        console.log('searhc')
    }

    return (
        <Card >
            <CardContent>
                <TextField
                    id="outlined-name"
                    label="Name"
                    value={name}
                    onChange={handleChange}
                />
            </CardContent>
        </Card>
    )
}
