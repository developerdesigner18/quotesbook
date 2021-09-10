/* eslint-disable no-use-before-define */
import { useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(3),
    },
  },
}));

export default function Topics({ loadTopics }) {
  const classes = useStyles();

  const [selectedTopics, setSelectedTopics] = useState("");
  loadTopics(selectedTopics);

  return (
    <div className={classes.root}>
      <Autocomplete
        size="small"
        multiple
        id="tags-standard"
        options={topics}
        getOptionLabel={(option) => option}
        getOptionDisabled={(options) =>
          selectedTopics.length > 1 ? true : false
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Topic"
            placeholder="Select up to 2 topics"
          />
        )}
        onChange={(e, val) => {
          setSelectedTopics(val);
        }}
      />
    </div>
  );
}

// Predefined topics by admin
const topics = ["Inspirational", "Positivity", "Motivational"];
