function convert2GeoJson(data)
{
	GeoJSON.parse(data, {Point: ['-LAT', '-LON']});
}