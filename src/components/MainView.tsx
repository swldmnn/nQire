import { AppBar, Box, Grid, Toolbar, Typography } from "@mui/material"
import Logo from "./Logo"
import RequestList from "./RequestList"
import TabView from "./TabView"
import { HttpRequest } from "./types"

const requests: HttpRequest[] = [
    {
        typename: 'HttpRequest',
        id: 1,
        label: 'JsonPlaceholder',
        method: 'POST',
        url: 'https://jsonplaceholder.typicode.com/posts',
        body: '{"foo":"bar"}',
    },
    {
        typename: 'HttpRequest',
        id: 2,
        label: 'IP API',
        method: 'GET',
        url: 'https://ipapi.co/json',
        body: undefined,
    },
    {
        typename: 'HttpRequest',
        id: 3,
        label: 'Countries',
        method: 'GET',
        url: 'https://restcountries.com/v3.1/all?fields=name,flags',
        body: undefined,
    },
    {
        typename: 'HttpRequest',
        id: 4,
        label: 'ChuckNorrisJoke',
        method: 'GET',
        url: 'https://api.chucknorris.io/jokes/random',
        body: undefined,
    },
    {
        typename: 'HttpRequest',
        id: 5,
        label: 'PokeAPI',
        method: 'GET',
        url: 'https://pokeapi.co/api/v2/pokemon/ditto',
        body: undefined,
    },
    {
        typename: 'HttpRequest',
        id: 6,
        label: 'RestAPI',
        method: 'POST',
        url: 'https://api.restful-api.dev/objects',
        body: '{"name": "Apple MacBook Pro 16","data": {"year": 2019,"price": 1849.99,"CPU model": "Intel Core i9","Hard disk size": "1 TB"}}'
    }
]

function MainView() {

    return (
        <Box id='mainView_root' sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100vh',
            boxSizing: 'border-box'
        }}>
            <Box id='mainView_header' sx={{
                display: 'flex',
                padding: '.8rem',
                width: '100%',
                boxSizing: 'border-box',
                bgcolor: 'grey.800',
                boxShadow: '0 6px 6px rgba(0, 0, 0, 0.2)'
            }}>
                <Logo />
                <Typography variant='h5' sx={{ marginLeft: '.5rem' }}>n</Typography>
                <Typography variant='h5' sx={{ color: 'primary.main' }}>Q</Typography>
                <Typography variant='h5' >ire</Typography>
            </Box>

            <Box id='mainView_content' sx={{
                display: 'flex',
                flexGrow: 1,
                minWidth: 0,
                minHeight: 0,
                boxSizing: 'border-box',
            }}>
                <Box id='mainView_navigation' sx={{
                    width: '20rem',
                    bgcolor: 'grey.900'
                }}>
                    <RequestList requests={requests} />
                </Box>

                <Box id='mainView_editor' sx={{
                    display: 'flex',
                    minWidth: 0,
                    minHeight: 0,
                    flexGrow: 1,
                }}>
                    <TabView />
                </Box>
            </Box>
        </Box>
    )
}

export default MainView