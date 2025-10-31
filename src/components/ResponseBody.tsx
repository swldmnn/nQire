import { Box, Typography } from "@mui/material"
import { HttpRequestResponseProps } from "./types"
import JSONPretty from "react-json-pretty";

interface ResponseBodyProps extends HttpRequestResponseProps {
}

function ResponseBody({ response }: ResponseBodyProps) {
  return <Box sx={{ borderRadius: 1, bgcolor: 'grey.800' }}>
    <Box sx={{
      padding: '.5rem',
      display: 'flex',
      borderBottom: '1px solid grey'
    }}>
      <Typography sx={{ color: 'grey.400' }}>Response </Typography>
      {(response?.status! > 0 && <Typography sx={{ color: 'secondary.main', paddingLeft: '.5rem' }}>[{response?.status}]</Typography>)}
    </Box>
    {response?.status! > 0 &&
      <Box sx={{ display: 'flex', overflow: "auto", flexGrow: 1, width: '100%', height: '100%', bgcolor: 'grey.900' }}>
        <JSONPretty id="json-pretty" data={response?.body ?? ''}></JSONPretty>
      </Box>}
  </Box>
}

export default ResponseBody