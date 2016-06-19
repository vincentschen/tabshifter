function findClusterByTab(clustersObj, tabId){
    var clusters = clustersObj.clusters;
    for (i = 0; i < clusters.length; i ++){
        var start = clusters[i].start;
        if (tabId >= start) {
            var end = clusters[i].end;
            if (tabId <= end) return clusters[i].id;
        }

    }
    return null;
}

/* Prerequesites: clusters must be a JSONArray (so the beginning "clusters" is already stripped), similarities must also be an array
*/
function computeClusterSimilarities(clusters, similarities){
    var highest = [0, 0];
    for (i = 0; i < clusters.length; i ++){
        var sum = 0;
        for (j = clusters[i].start; j <= clusters[i].end; j ++){
            sum += similarities[j];
        }
        var average = sum/(clusters[i].end - clusters[i].start + 1);
	if (average > highest[0]) highest = [average, i];
    }
    return highest;
}

function tabUpdated(clustersObj, similarities){
    var threshold = 0.5;
    var highest = computeClusterSimilarities(clustersObj.clusters,similarities);
    if (highest[0] > threshold){
        clustersObj.clusters[highest[1]].end ++;
        for (i = 0; i < clustersObj.clusters.length; i ++) {
            if (clustersObj.clusters[i].end > clustersObj.clusters[highest[1]].end) {
                clustersObj.clusters[i].start ++;
		clustersObj.clusters[i].end ++;
            }
        }
    } else {
        clustersObj['clusters'].push({"id": clustersObj.clusters.length, "start": similarities.length, "end": similarities.length});
    }
    return clustersObj;
}