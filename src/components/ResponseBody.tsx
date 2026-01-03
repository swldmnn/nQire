import { Box, useColorScheme } from "@mui/material"
import { HttpRequestResponseProps } from "../types/types"
import JSONPretty from "react-json-pretty";

interface ResponseBodyProps extends HttpRequestResponseProps {
}

function ResponseBody({ response }: ResponseBodyProps) {
  const { mode } = useColorScheme();
  const themeClass = mode === 'dark' ? 'dark-theme' : 'light-theme';

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
      minWidth: 0,
      minHeight: 0,
      overflow: 'auto',
    }}>
      <div className={`json-pretty-wrapper ${themeClass}`}>
        <JSONPretty id="json-pretty" data={response?.body ?? ''}></JSONPretty>
      </div>
    </Box>
  </Box>
}

export default ResponseBody