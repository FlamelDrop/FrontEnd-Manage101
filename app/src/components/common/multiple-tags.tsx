import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

interface IComponents {
  items: any[]
  keyValue: string
  defaultValues?: any[] | undefined
}

const MultipleTags = (props: IComponents) => {
  const { items, keyValue, defaultValues=[] } = props
  const [value, setValue] = useState(defaultValues);

  const handleKeyDown = (event:any) => {
    switch (event.key) {
      case ",":
      case " ": {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.value.length > 0) {
          setValue(event.target.value)
          setValue([...value, event.target.value])
        }
        break;
      }
      default: 
    }
  }
  
  return (
    <div>
      <Autocomplete
        multiple
        // freeSolo
        id="tags-outlined"
        options={items}
        getOptionLabel={option => {
          if (typeof option === "string") {
            return option;
          }
          return option[keyValue];
        }}
        defaultValue={defaultValues.map(v => items.find(item => v.id === item.id) )}
        onChange={(event, newValue:any) => setValue(newValue)}
        filterSelectedOptions
        onKeyDown={handleKeyDown}
        renderInput={(params) => {
          // params.inputProps.onKeyDown = handleKeyDown;
          return (
            <TextField
              {...params}
              name={`tags`}
              label="Tags"
              variant="outlined"
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
          );
        }}
      />
    </div>
  );
}

export default MultipleTags