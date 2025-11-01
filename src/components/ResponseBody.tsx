import { Box, Typography } from "@mui/material"
import { HttpRequestResponseProps } from "./types"
import JSONPretty from "react-json-pretty";

interface ResponseBodyProps extends HttpRequestResponseProps {
}

function ResponseBody({ response }: ResponseBodyProps) {
  return <Box sx={{
    width: '100%',
    height: '100%',
    overflow: 'auto',
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 1,
    boxSizing: 'border-box',
  }}>
    <Box sx={{
      padding: '.5rem',
      display: 'flex',
      bgcolor: 'grey.800',
      borderBottom: '1px solid grey',
    }}>
      <Typography sx={{ color: 'grey.400' }}>Response </Typography>
      {(response?.status! > 0 && <Typography sx={{ color: 'secondary.main', paddingLeft: '.5rem' }}>[{response?.status}]</Typography>)}
    </Box>
    {response?.status! > 0 &&
      <Box sx={{
        bgcolor: 'grey.900',
        minWidth: 0,
        minHeight: 0,
        overflow: 'auto',
      }}>
        <JSONPretty id="json-pretty" data={response?.body ?? ''}></JSONPretty>
      </Box>}
  </Box>
}

export default ResponseBody