import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/material";
import { Snackbar, SnackbarContent, colors } from "@mui/material";
import  {check_circle} from "@mui/icons-material";

const useStyles = makeStyles(theme => ({
    content: {
        backgroundColor: colors.green[600]
    },
    message: {
        display: "flex",
        alignItems: "center"
    },
    icon: {
        marginRight: theme.spacing(2)
    }
}));

const SuccessSnackbar = props => {
    const { open, onClose } = props;

    const classes = useStyles();

    return (
        <Snackbar
            anchorOrigin={{
                vertical: "top",
                horizontal: "center"
            }}
            autoHideDuration={6000}
            onClose={onClose}
            open={open}
        >
            <SnackbarContent
                className={classes.content}
                message={
                    <span className={classes.message}>
            <check_circle className={classes.icon} />
            Successfully saved changes!
          </span>
                }
                variant="h6"
            />
        </Snackbar>
    );
};

SuccessSnackbar.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

SuccessSnackbar.defaultProps = {
    open: true,
    onClose: () => {}
};

export default SuccessSnackbar;