import { Box, Button, IconButton, Typography, useColorScheme } from "@mui/material"
import Logo from "./Logo"
import RequestList from "./RequestList"
import TabView from "./TabView"
import { HttpRequest } from "./types"
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';

const requests: HttpRequest[] = [
    {
        typename: 'HttpRequest',
        id: 1,
        label: 'JsonPlaceholder',
        method: 'POST',
        headers: [
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Accept', value: '*/*' },
        ],
        url: 'https://jsonplaceholder.typicode.com/posts',
        body: '{"foo":"bar"}',
    },
    {
        typename: 'HttpRequest',
        id: 2,
        label: 'IP API',
        method: 'GET',
        headers: [
            { key: 'Accept', value: '*/*' },
        ],
        url: 'https://ipapi.co/json',
        body: undefined,
    },
    {
        typename: 'HttpRequest',
        id: 3,
        label: 'Countries',
        method: 'GET',
        headers: [
            { key: 'Accept', value: '*/*' },
        ],
        url: 'https://restcountries.com/v3.1/all?fields=name,flags',
        body: undefined,
    },
    {
        typename: 'HttpRequest',
        id: 4,
        label: 'ChuckNorrisJoke',
        method: 'GET',
        headers: [
            { key: 'Accept', value: '*/*' },
        ],
        url: 'https://api.chucknorris.io/jokes/random',
        body: undefined,
    },
    {
        typename: 'HttpRequest',
        id: 5,
        label: 'PokeAPI',
        method: 'GET',
        headers: [
            { key: 'Accept', value: '*/*' },
        ],
        url: 'https://pokeapi.co/api/v2/pokemon/ditto',
        body: undefined,
    },
    {
        typename: 'HttpRequest',
        id: 6,
        label: 'RestAPI',
        method: 'POST',
        headers: [
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Accept', value: '*/*' },
        ],
        url: 'https://api.restful-api.dev/objects',
        body: '{"name": "Apple MacBook Pro 16","data": {"year": 2019,"price": 1849.99,"CPU model": "Intel Core i9","Hard disk size": "1 TB"}}'
    }
]

function MainView() {

    const { mode, setMode } = useColorScheme();

    return (
        <Box id='mainView_root' sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100vh',
            boxSizing: 'border-box',
            bgcolor: 'background.default',
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
                <Button sx={{marginLeft: 'auto'}} onClick={() => {setMode(mode==='dark' ? 'light' : 'dark')}}>
                    {mode==='light' ? <BrightnessHighIcon /> : <BrightnessLowIcon/>}
                </Button>
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
                            borderRight: '1px solid',
                            borderColor: 'divider',
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