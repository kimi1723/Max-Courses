import { useAccordionContext } from './Accordion';

export const AccordionTitle = ({ id, children, className }) => {
	const { toggleItem } = useAccordionContext();

	return (
		<h3 className={className} onClick={() => toggleItem(id)}>
			{children}
		</h3>
	);
};
