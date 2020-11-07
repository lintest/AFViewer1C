var viewer;
var md_ViewerDocument;
var md_viewables;
var CurrentDocId, CurrentToken;
var inputs = document.querySelectorAll('input');

function DisplayViewer() {
    var options = {
        env: 'AutodeskProduction',
        api: 'derivativeV2', // for models uploaded to EMEA change this option to 'derivativeV2_EU'
        getAccessToken: function (onTokenReady) {
            var timeInSeconds = 3600; // Use value provided by Forge Authentication (OAuth) API
            onTokenReady(window.AutodeskToken, timeInSeconds);
        }
    }
    Autodesk.Viewing.Initializer(options, function () {
        var htmlDiv = document.getElementById('forgeViewer');
        viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv);
        var startedCode = viewer.start();
        if (startedCode > 0) {
            console.error('Failed to create a Viewer: WebGL not supported.');
            return;
        }
        console.log('Initialization complete, loading a model next...');
    });
    Autodesk.Viewing.Document.load(window.AutodeskDocId, onDocumentLoadSuccess, onDocumentLoadFailure);
};

function onDocumentLoadSuccess(viewerDocument) {
    var viewerapp = viewerDocument.getRoot();
    md_ViewerDocument = viewerDocument;
    md_viewables = viewerapp.search({ 'type': 'geometry' });
    if (md_viewables.length === 0) {
        console.error('Document contains no viewables.');
        return;
    }
    viewer.loadDocumentNode(viewerDocument, md_viewables[0]);
    viewer.loadExtension('Autodesk.ADN.Viewing.Extension.Color');
}

function onDocumentLoadFailure() {
    console.error('Failed fetching Forge manifest');
}

if (window.AutodeskDocId) DisplayViewer();
