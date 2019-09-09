/** @format */

import React from 'react';
import {PixelRatio, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DialogAndroid from 'react-native-dialogs';

export default class App extends React.Component {
    state = {
        avatarSource: null,
        videoSource: null,
    };

    methodsThatShowDialogs;

    constructor(props) {
        super(props);
        this.methodsThatShowDialogs = [
            //this.showHorizontalProgress,
            //this.showCircularProgress,
            this.showPicker,
            this.showAutoDismissPicker,
            this.showCheckboxPicker,
            this.showCheckboxPickerWithClearButton,
            this.showPrompt,
            this.showDialogWithDefaults,
            this.showAlertWithHtml,
        ];
        this.state = {
            currentDialogIndex: 0,
        };
    }

    showHorizontalProgress = () =>
        DialogAndroid.showProgress('Downloading...', {
            style: DialogAndroid.progressHorizontal,
        });

    showCircularProgress = async () => {
        setTimeout(DialogAndroid.dismiss, 5000);
        await DialogAndroid.showProgress('Downloading...');
    };

    showPicker = async () => {
        const {selectedItem} = await DialogAndroid.showPicker('Pick a fruit', null, {
            items: [
                {label: 'Apple', id: 'apple'},
                {label: 'Orange', id: 'orange'},
                {label: 'Pear', id: 'pear'},
            ],
        });
        if (selectedItem) {
            // when negative button is clicked, selectedItem is not present, so it doesn't get here
            console.log('You selected item:', selectedItem);
        }
    };

    showAutoDismissPicker = async () => {
        const {selectedItem} = await DialogAndroid.showPicker('Pick a fruit', null, {
            negativeText: 'Cancel',
            type: DialogAndroid.listRadio,
            selectedId: 'apple',
            items: [
                {label: 'Apple', id: 'apple'},
                {label: 'Orange', id: 'orange'},
                {label: 'Pear', id: 'pear'},
            ],
        });
        if (selectedItem) {
            // when negative button is clicked, selectedItem is not present, so it doesn't get here
            console.log('You picked:', selectedItem);
        }
    };

    _showCheckboxPicker = async extraProps => {
        const {selectedItems} = await DialogAndroid.showPicker('Select multiple fruits', null, {
            type: DialogAndroid.listCheckbox,
            selectedIds: ['apple', 'orange'],
            extraProps,
            items: [
                {label: 'Apple', id: 'apple'},
                {label: 'Orange', id: 'orange'},
                {label: 'Pear', id: 'pear'},
            ],
        });
        if (selectedItems) {
            if (!selectedItems.length) {
                console.log('You selected no items.');
            } else {
                console.log('You selected items:', selectedItems);
            }
        }
    };

    showCheckboxPicker = () => this._showCheckboxPicker();

    showCheckboxPickerWithClearButton = () =>
        this._showCheckboxPicker({neutralIsClear: true, neutralText: 'Clear'});

    showPrompt = async () => {
        const {action, text} = await DialogAndroid.prompt('Title - optional', 'Message - optional');
        if (action === DialogAndroid.actionPositive) {
            console.log(`You submitted: "${text}"`);
        }
    };

    showDialogWithDefaults = async () => {
        DialogAndroid.assignDefaults({
            title: 'Default Title',
            message: 'Default Message',
            positiveText: null,
            contentColor: 'rgba(0, 0, 0, 0.2)',
            widgetColor: 'blue',
        });
        const {action, text} = await DialogAndroid.prompt();
        if (action === DialogAndroid.actionPositive) {
            console.log(`You submitted: "${text}"`);
        }
    };

    showAlertWithHtml = () =>
        DialogAndroid.alert(
            'Title',
            `This is a link <a href="https://www.duckduckgo.com/">DuckDuckGo</a>`,
            {
                contentIsHtml: true,
            }
        );

    showNextDialog = async () => {
        if (this.isLastDialogShown) {
            return;
        }
        await this.methodsThatShowDialogs[this.state.currentDialogIndex]();
        this.setState({currentDialogIndex: this.state.currentDialogIndex + 1});
    };

    restart = () => {
        this.setState({currentDialogIndex: 0});
    };

    render() {
        return this.isLastDialogShown ? (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 25}}>All dialogs have been shown</Text>
                <TouchableOpacity onPress={this.restart}>
                    <Text style={{margin: 10, fontSize: 15, color: 'blue'}}>Restart</Text>
                </TouchableOpacity>
            </View>

        ) : (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.showNextDialog}>
                    <View style={[styles.avatar, styles.avatarContainer]}>
                        <Text>Show next dialog</Text>
                    </View>
                </TouchableOpacity>

                {this.state.videoSource && (
                    <Text style={{margin: 8, textAlign: 'center'}}>{this.state.videoSource}</Text>
                )}
            </View>
        );
    }

    get isLastDialogShown() {
        return this.state.currentDialogIndex === this.methodsThatShowDialogs.length - 1;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        borderRadius: 75,
        width: 150,
        height: 150,
    },
});
