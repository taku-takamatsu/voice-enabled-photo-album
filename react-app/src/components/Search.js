import React from 'react';
import { useState } from 'react';
import Transcribe from './Transcribe';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import API from '../api/apigClient';

export default function Search(props) {
    const name = 'Search...'    
    const [value, setValue] = useState('');
    const { setItemData,setLoading } = props;
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuItem, setMenuItem] = useState('label');
    const open = Boolean(menuAnchor);

    const handleMenuClick = (event, item) => {
      setMenuAnchor(event.currentTarget);
      setMenuItem(item)
    };
    const handleMenuClose = () => {
      setMenuAnchor(null);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    }
    
    const handleOnClick = (event) => {
        event.preventDefault();
        setLoading(true);
        API.get(`/search`, {
            params : {
                q : value
            },
            headers : {
                'Content-Type': 'application/json',
                'x-api-key' : process.env.REACT_APP_API_KEY
            }},
        )
        .then(res => {
            setItemData(res.data);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setItemData([]);
            setLoading(false);
        })
    }

    return (
        <>
    <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
        >
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" onClick={handleOnClick}>
            <SearchIcon />
        </IconButton>
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={`Search ${menuItem === 'custom' ? 'custom labels' : 'images'}`}
            inputProps={{ 'aria-label': `Search ${menuItem === 'custom' ? 'custom labels' : 'images'}` }}
            value={value}
            onChange={handleChange}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <Transcribe response={value} setResponse={setValue}/>
    </Paper>
    <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={menuAnchor}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
        }}
        transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
        }}
    >
        <MenuItem onClick={(e) => handleMenuClick(e, 'images')}>Labels</MenuItem>
        <MenuItem onClick={(e) => handleMenuClick(e, 'custom')}>Custom Label</MenuItem>
    </Menu>
  </>
    )
}
