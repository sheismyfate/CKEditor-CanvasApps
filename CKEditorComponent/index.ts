import { ENGINE_METHOD_DIGESTS } from "constants";
import {IInputs, IOutputs} from "./generated/ManifestTypes";


export class CKEditorComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	
	private _context: ComponentFramework.Context<IInputs>;
	private _container : HTMLDivElement;
	private _toolbarContainer:HTMLDivElement;
	private _editorDiv:HTMLDivElement;
	private DecoupledEditor :any; 
	private _editorContent:any;
	private _notifyOutputChanged: () => void;

	/**
	 * Empty constructor.
	 */
	constructor()
	{
        this.DecoupledEditor =require('@ckeditor/ckeditor5-build-decoupled-document');
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
	this._notifyOutputChanged=notifyOutputChanged;
	this._context=context;
	this._editorContent=this._context.parameters.editorContent.raw || "";

    this._toolbarContainer=document.createElement("div");
	this._toolbarContainer.setAttribute("id","id_toolbarcontainer");

	this._editorDiv=document.createElement("div");
	this._editorDiv.setAttribute("id","id_divforeditor");
	this._editorDiv.innerHTML=this._editorContent;

	this._container = container;
	this._container.appendChild(this._toolbarContainer);
	this._container.appendChild(this._editorDiv);

	container = this._container;
	  
    this.DecoupledEditor.create( document.querySelector( '#id_divforeditor')).then((editor:any)=>{
		 let toolbarSelector:any;
		 toolbarSelector=document.querySelector( '#id_toolbarcontainer');
		 toolbarSelector.appendChild( editor.ui.view.toolbar.element);
		 toolbar: [ 'heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote' ];
         heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' }
            ]};
		  (window as any).editor =editor;
		  editor.model.document.on( 'change:data', ( evt:any , data:any ) => {
			  console.log(data);
			this._editorContent=editor.getData();
			this._notifyOutputChanged();
        } );
	 })
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		this._context=context;
		this._editorContent=this._context.parameters.editorContent.raw||"";
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			editorContent : this._editorContent
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}