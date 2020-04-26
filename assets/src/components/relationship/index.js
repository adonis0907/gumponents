import './editor.scss';

import wp from 'wp';
import classnames from 'classnames';
import Selector from './selector';

const { __ } = wp.i18n;
const {
	Button,
	Modal,
	Spinner,
	BaseControl,
} = wp.components;
const {
	useState,
	useEffect,
} = wp.element;

export default function Relationship( { initialItems, label, searchQuery, help, buttonLabel = __( 'Select' ), modalTitle = __( 'Select' ), noSelectionLabel = __( 'No selection' ), minimal = false, max = -1, onSelect, onSetItems } ) {
	const [ items, setItems ] = useState( [] );
	const [ userSelection, setUserSelection ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const [ modalOpen, setModalOpen ] = useState( false );

	useEffect(
		() => {
			setItems( initialItems );
			setLoading( false );
		},
		[ initialItems ]
	);

	const selectItems = () => {
		setItems( userSelection );
		setModalOpen( false );
		if ( onSelect ) {
			onSelect( userSelection.map( ( item ) => item.value ) );
		}
		onSetItems( userSelection );
	};

	return (
		<BaseControl
			label={ label }
			help={ help }
			className="gumponent-relationship"
		>
			<Button
				isSecondary
				isBusy={ minimal && loading }
				onClick={ () => setModalOpen( true ) }
			>
				{ buttonLabel }
			</Button>
			{ ! minimal &&
				<ul className={ classnames( 'gumponent-relationship__selected-items', { 'gumponents-relationship__selected-items--loading': loading } ) }>
					{ loading &&
						<li><Spinner /></li>
					}
					{ ! loading && 0 !== items.length &&
						items.map( ( item, index ) => {
							if ( 3 === index ) {
								return <li>... { `${ items.length - 3 } ${ __( 'more' ) }` }</li>;
							} else if ( index > 3 ) {
								return; // eslint-disable-line
							}
							return <li key={ index }>✓ { item.label }</li>;
						} )
					}
					{ ! loading && 0 === items.length &&
						<li>{ noSelectionLabel }</li>
					}
				</ul>
			}
			{ modalOpen &&
				<Modal
					title={ modalTitle }
					className="gumponent-relationship__modal"
					onRequestClose={ () => setModalOpen( false ) }>
					<Selector
						maxItems={ max }
						onSelect={ ( newItems ) => setUserSelection( newItems ) }
						selected={ items }
						searchQuery={ searchQuery }
					/>
					<div className="gumponent-relationship__modal__actions">
						<Button
							isPrimary
							onClick={ selectItems }
						>
							{ __( 'Select' ) }
						</Button>
					</div>
				</Modal>
			}
		</BaseControl>
	);
}
