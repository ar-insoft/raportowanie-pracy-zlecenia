import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };

        this.logToJava("ErrorBoundary is working")
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true, error, info });
        // You can also log the error to an error reporting service
        this.logErrorToService(error, info);
        this.logToJava("Error " + JSON.stringify({ error, info }))
    }

    logToJava = (msg) => {
        try {
            if (window.javaBridge && window.javaBridge.log) {
                window.javaBridge.log(msg)
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    logErrorToService = (error, info) => {
        const doWyslaniaJson = JSON.stringify({ error, info, javaBridge: window.javaBridge, })
        fetch('/eoffice/production/raportowanie_produkcji_lasera/raportowanie_produkcji_lasera_json_endpoint.xml?action=log_error_to_service', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' //'Content-Type': 'application/json' 
            },
            body: 'errorInfo=' + doWyslaniaJson //+ info.componentStack
        })
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div style={{ margin: 10+'px' }}>
                <h2 style={{ color: 'red' }}>Something went wrong</h2>
                <h1>Nie udało się uruchomić strony</h1>
                <div>{this.state.error && this.state.error.name}</div>
                <div>Component stack: {this.state.info && this.state.info.componentStack}</div>
            </div>
        }
        return this.props.children;
    }
}

export default ErrorBoundary