import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Column, ColumnProps, Flex, Text } from '../..';
import { useNitroCardAccordionContext } from './NitroCardAccordionContext';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export interface NitroCardAccordionSetInnerViewProps extends ColumnProps
{
    headerText: string;
    isExpanded?: boolean;
}

export const NitroCardAccordionSetInnerView: FC<NitroCardAccordionSetInnerViewProps> = props =>
{
    const { headerText = '', isExpanded = false, gap = 0, classNames = [], children = null, ...rest } = props;
    const [ isOpen, setIsOpen ] = useState(false);
    const { setClosers = null, closeAll = null } = useNitroCardAccordionContext();

    const onClick = () =>
    {

        setIsOpen(prevValue => !prevValue);
    }

    const close = useCallback(() => setIsOpen(false), []);

    const getClassNames = useMemo(() =>
    {
        const newClassNames = [ 'nitro-card-accordion-set' ];

        if(isOpen) newClassNames.push('active');

        if(classNames && classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ isOpen, classNames ]);

    useEffect(() =>
    {
        setIsOpen(isExpanded);
    }, [ isExpanded ]);

    useEffect(() =>
    {
        const closeFunction = close;

        setClosers(prevValue =>
            {
                const newClosers = [ ...prevValue ];

                newClosers.push(closeFunction);

                return newClosers;
            });

        return () =>
        {
            setClosers(prevValue =>
                {
                    const newClosers = [ ...prevValue ];

                    const index = newClosers.indexOf(closeFunction);

                    if(index >= 0) newClosers.splice(index, 1);

                    return newClosers;
                });
        }
    }, [ close, setClosers ]);

    return (
        <Column classNames={ getClassNames } gap={ gap } { ...rest }>
            <Flex pointer justifyContent="between" className="nitro-card-accordion-set-header px-2 py-1" onClick={ onClick }>
                <Text>{ headerText }</Text>
                { isOpen && <FaChevronUp className="fa-icon" /> }
                { !isOpen && <FaChevronDown className="fa-icon" /> }
            </Flex>
            { isOpen &&
                <Column fullHeight overflow="auto" gap={ 0 } className="nitro-card-accordion-set-content p-1">
                    { children }
                </Column> }
        </Column>
    );
}
