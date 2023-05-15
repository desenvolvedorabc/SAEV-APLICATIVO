import { useRef, useState } from "react";
import { MdOutlineUpload } from "react-icons/md"; 
import { Box, ButtonBase, TextField, useTheme } from '@mui/material';
import { Icon } from "./styledComponents";

const InputFile = ({ label, onChange, error, initialValue = null, acceptFile }) => {
  const ref = useRef();
  const theme = useTheme();
  // const classes = useStyles();
  const [attachment, setAttachment] = useState(null);

  const handleChange = (event) => {
    const file = event.target.files[0];
    setAttachment(file);
    if (!!onChange) onChange({ target: { value: file } });
  };

  return (
    <div className="col d-flex">
      <Box
        position="relative"
        className="col"
        height={38}
        color={
          !!error ? theme.palette.error.main : theme.palette.background.paper
        }
      >
        <Box 
          position="absolute" top={0} bottom={0} left={0} right={0}
          >
          <TextField
            //className={classes.field}
            sx={{
              "& .MuiFormLabel-root.Mui-disabled": {
                color: theme.palette.text.secondary,
                fontSize: "14px",
              },
              "& .MuiFormLabel-root": {
                paddingRight: "30px",
              },
            }}
            margin="none"
            size="small"
            fullWidth
            disabled
            label={label}
            value={attachment?.name || ""}
            error={!!error}
            helperText={error?.message || false}
          />
        </Box>
        <ButtonBase
          //className={classes.button}
          sx={{
            width: "100%",
            height: "100%",
            overflow: "hidden"
          }}
          component="label"
          onKeyDown={(e) => e.keyCode === 32}
        >
          <input
            ref={ref}
            type="file"
            accept={acceptFile}
            hidden
            onChange={handleChange}
          />
        </ButtonBase>
      </Box>
      <Icon>
        <MdOutlineUpload size={20} color={"#3E8277"}/>
      </Icon>
    </div>
  );
};

export default InputFile;
