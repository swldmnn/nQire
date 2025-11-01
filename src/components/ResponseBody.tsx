import { Box } from "@mui/material"
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
    {response?.status! > 0 &&
      <Box sx={{
        minWidth: 0,
        minHeight: 0,
        overflow: 'auto',
      }}>
        <JSONPretty id="json-pretty" data={response?.body ?? ''}></JSONPretty>
      </Box>}
  </Box>
}

export default ResponseBody