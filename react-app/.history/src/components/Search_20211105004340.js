import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { TextField } from '@material-ui/core';
import { useState, useEffect } from 'react';

export default function Search() {
    const name = 'Search...'    
    const [value, setValue] = useState();
    const handleChange = () => {
        setValue(value);
    }

    return (
        <Card >
            <CardContent>
                <TextField
                    id="outlined-name"
                    label="Name"
                    value={value}
                    onChange={handleChange}
                />
            </CardContent>
        </Card>
    )
}
