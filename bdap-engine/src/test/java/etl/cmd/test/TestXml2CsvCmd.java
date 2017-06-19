package etl.cmd.test;

import java.util.ArrayList;
import java.util.List;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.mapreduce.lib.input.SequenceFileInputFormat;
import org.junit.Test;

import etl.cmd.test.TestETLCmd;
import etl.input.XmlInputFormat;
import scala.Tuple2;

public class TestXml2CsvCmd extends TestETLCmd{

	private static final String cmdClassName = "etl.cmd.dynschema.Xml2CsvCmd";
	
	@Test
	public void runGenCsvCmd() throws Exception {
		//
		String inputFolder = "/etltest/pde2/input/";
		String outputFolder = "/etltest/pde2/output/";
		String cfgFolder = "/etltest/pde2/cfg/";
		String dataFolder= "/etltest/pde2/data/";
		
		String csvtransProp = "xml2csv.properties";
		
		String[] inputFiles = new String[]{"20170226235246Z.xml"};
//		String[] inputFiles = new String[]{"NODE4g911-oam-blade-3.seq"};
//		String[] inputFiles = new String[]{"20170226235154Z.xml","20170226235209Z.xml","20170226235246Z.xml","20170226235311Z.xml"};
		
		getFs().delete(new Path(dataFolder), true);
		getFs().mkdirs(new Path(dataFolder));
		
		getFs().delete(new Path(outputFolder), true);
		getFs().mkdirs(new Path(outputFolder));
		
		getFs().delete(new Path(cfgFolder), true);
		getFs().mkdirs(new Path(cfgFolder));
		//schema
		//getFs().delete(new Path("/attmexico/huawei/schema"), true);
		//getFs().copyFromLocalFile(false, true, new Path("./src/main/resources/huawei/schema/"), new Path("/attmexico/huawei/schema"));
		
		//run cmd
		List<Tuple2<String, String[]>> rfifs = new ArrayList<Tuple2<String, String[]>>();
		rfifs.add(new Tuple2<String, String[]>(inputFolder, inputFiles));
		getConf().set("xmlinput.start", "<MALSTransLog ");
		getConf().set("xmlinput.end", "</MALSTransLog>");
		getConf().set("xmlinput.row.start", "<Trans>");
		getConf().set("xmlinput.row.end", "</Trans>");
		getConf().set("xmlinput.row.max.number", "1000");

		super.mrTest(rfifs, outputFolder, csvtransProp, cmdClassName, XmlInputFormat.class);
//		super.mrTest(rfifs, outputFolder, csvtransProp, cmdClassName, SequenceFileInputFormat.class);
	}
	
	@Override
	public String getResourceSubFolder() {
		return "xml2csv/";
	}
}
