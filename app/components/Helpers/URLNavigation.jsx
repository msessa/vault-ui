import React, { PropTypes, Component } from 'react'
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export default class URLNavigationDialog extends Component {
    static propTypes = {
        path: PropTypes.string,
        forceShowDialog: PropTypes.bool,
        onReceiveResponse: PropTypes.func,
        onReceiveError: PropTypes.func,
        onModalClose: PropTypes.func
    }

    static defaultProps = {
        path: ''
    }

    constructor(props) {
        super(props)
    }

    state = {
        path: '',
        openNavigationModal: false
    };

    componentDidMount() {
        // Register event listener on Desktop app only
        if (!WEBPACK_DEF_TARGET_WEB) {
            require('electron').ipcRenderer.on('open-url-navigation-dialog', (event, arg) => {
                this.setState({ openNavigationModal: true })
            })
        }
    }


    navigateToUrl = () => {
        // Send event on Desktop app only
        if (!WEBPACK_DEF_TARGET_WEB) {
            require('electron').ipcRenderer.send('shortcut-navigate', this.state.path)
        }
        this.setState({openNavigationModal: false, path: ''});
    }

    render() {
        const actions = [
            <FlatButton label="Cancel" secondary={true} onTouchTap={() => { this.setState({ openNavigationModal: false, path: '' }); this.props.onModalClose() }} />,
            <FlatButton label="Navigate" primary={true} onTouchTap={this.navigateToUrl} />
        ];

        return (
            <Dialog
                title="Shortcut URL Navigation"
                modal={true}
                open={this.state.openNavigationModal}
                actions={actions}
            >
                <TextField
                    hintText='Enter the shortcut navigation URL'
                    floatingLabelFixed={true}
                    floatingLabelText='Go to URL'
                    fullWidth={true}
                    autoFocus
                    onChange={(e) => {
                        this.setState({ path: e.target.value });
                    }}
                />
            </Dialog>
        )
    }
}