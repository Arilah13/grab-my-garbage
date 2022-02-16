import { Bubble, Send, InputToolbar, Composer, Message } from 'react-native-gifted-chat'
import { Icon } from 'react-native-elements'

export const renderBubble = (props) => {
    return (
        <Bubble
            {...props}
            wrapperStyle = {{
                right: {
                    backgroundColor: colors.darkBlue
                },
                left: {
                    backgroundColor: colors.white,
                }
            }}
            textStyle = {{
                right: {
                    color: colors.white
                }
            }}
        />
    );
}

export const renderSend = (props) => {
    return(
        <Send {...props}>
            <View>
                <Icon 
                    type = 'material-community'
                    name = 'send-circle'
                    size = {32}
                    color = {colors.darkBlue}
                    style = {{
                        marginRight: 5,
                        marginBottom: 7
                    }}
                />
            </View>
        </Send>
    );
}

export const scrollToBottomComponent = () => {
    return(
        <Icon
            type = 'font-awesome'
            name = 'angle-double-down'
            size = {22}
            color = {colors.darkBlue}
        />
    )
}

export const renderInputToolbar = (props) => {
    return(
        <InputToolbar
            {...props}
            containerStyle = {{
                borderRadius: 15,
                height: 45,
                backgroundColor: colors.blue1
            }}
        />
    )
}

export const renderComposer = (props) => {
    return(
        <Composer 
            {...props}
            placeholderTextColor = {colors.blue2}
        />
    )
}

export const renderMessage = (props) => {
    return(
        <Message 
            {...props}
            renderAvatar = {null}
        />
    )
}