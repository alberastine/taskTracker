import React, { ReactNode } from 'react';

interface WidgetWrapperProps {
    children: ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
    children,
    style,
    className,
}) => {
    const containerStyle = {
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1rem',
        ...style,
    };

    return (
        <div style={containerStyle} className={className}>
            {children}
        </div>
    );
};

export default WidgetWrapper;
