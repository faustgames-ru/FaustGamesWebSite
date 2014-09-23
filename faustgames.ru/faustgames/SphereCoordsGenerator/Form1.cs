using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SphereCoordsGenerator
{
    public partial class Form1 : Form
    {
        public void GenerateeLensCoordsXp()
        {
            float baseX = -2048;
            float scaleY = -2.0f;
            float scaleZ = 2.0f;
            float centerY = 1024;
            float centerZ = 1024;

            var coords = new[]
                {
                    new[] {416f, 587f, 0.2f},
                    new[] {515f, 1050f, 0.1f},
                    new[] {623f,1418f, 0.1f},
                    new[] {629f,275f, 0.2f},
                    new[] {815f,750f, 0.1f},
                    new[] {869f,1178f, 0.1f},
                    new[] {1178f,863f, 0.1f},
                    new[] {1268f,935f, 0.1f},
                    new[] {1409f,626f, 0.3f},
                    new[] {1439f,1685f, 0.2f},
                };

            var result = new float[coords.Length][];
            var resultStr = "";
            var culture = new System.Globalization.CultureInfo("en-us");
            for (int i = 0; i < coords.Length; i++)
            {
                var coord = coords[i];
                result[i] = new float[3];
                result[i][0] = baseX;
                result[i][1] = scaleY * (coord[1] - centerY);
                result[i][2] = scaleZ * (coord[0] - centerZ);
                resultStr += string.Format(culture, "new Light({0:0.0}f, {1:0.0}f, {2:0.0}f, {3:0.000}f), \r\n", result[i][0], result[i][1], result[i][2], coord[2]);
            }
            textBox1.Text = resultStr;
        }

        public void GenerateeLensCoordsYp()
        {
            float baseY = 2048;
            float scaleX = -2.0f;
            float scaleZ = 2.0f;
            float centerX = 1024;
            float centerZ = 1024;

            var coords = new[]
                {
                    new[] {395, 1394, 0.05f},
                    new[] {506, 632, 0.1f},
                    new[] {746, 1016, 0.05f},
                    new[] {1061, 1091, 0.05f},
                    new[] {1025, 1823, 0.05f},
                    new[] {1169, 830, 0.1f},
                    new[] {1313, 353, 0.2f},
                    new[] {1511, 1031, 0.2f},
                    new[] {1790, 1775, 0.2f},
                    new[] {1820, 1196, 0.2f},
                };

            var result = new float[coords.Length][];
            var resultStr = "";
            var culture = new System.Globalization.CultureInfo("en-us");
            for (int i = 0; i < coords.Length; i++)
            {
                var coord = coords[i];
                result[i] = new float[3];
                result[i][2] = baseY;
                result[i][1] = scaleX * (coord[1] - centerX);
                result[i][0] = scaleZ * (coord[0] - centerZ);
                resultStr += string.Format(culture, "new Light({0:0.0}f, {1:0.0}f, {2:0.0}f, {3:0.000}f), \r\n", result[i][0], result[i][1], result[i][2], coord[2]);
            }
            textBox1.Text = resultStr;
        }

        public void GenerateeLensCoordsYm()
        {
            float baseY = -2048;
            float scaleX = -2.0f;
            float scaleZ = -2.0f;
            float centerX = 1024;
            float centerZ = 1024;

            var coords = new[]
                {
                    new[] {254, 260, 0.2f},
                    new[] {407, 1145, 0.1f},
                    new[] {551, 695, 0.3f},
                    new[] {716, 1820, 0.2f},
                    new[] {728, 473, 0.2f},
                    new[] {1106, 1610, 0.3f},
                    new[] {1193, 296, 0.1f},
                    new[] {1535, 503, 0.1f},
                    new[] {1580, 1037, 0.1f},
                    new[] {1769, 1253, 0.2f},
                    new[] {1793, 236, 0.3f},

                };

            var result = new float[coords.Length][];
            var resultStr = "";
            var culture = new System.Globalization.CultureInfo("en-us");
            for (int i = 0; i < coords.Length; i++)
            {
                var coord = coords[i];
                result[i] = new float[3];
                result[i][2] = baseY;
                result[i][1] = scaleX * (coord[1] - centerX);
                result[i][0] = scaleZ * (coord[0] - centerZ);
                resultStr += string.Format(culture, "new Light({0:0.0}f, {1:0.0}f, {2:0.0}f, {3:0.000}f), \r\n", result[i][0], result[i][1], result[i][2], coord[2]);
            }
            textBox1.Text = resultStr;
        }

        public void GenerateeLensCoordsZm()
        {
            float baseZ = -2048;
            float scaleX = -2.0f;
            float scaleY = 2.0f;
            float centerX = 1024;
            float centerY = 1024;

            var coords = new[]
                {
                    new[] {512, 1526, 0.1f},
                    new[] {788, 755, 0.2f},
                    new[] {1097, 1103, 0.3f},
                    new[] {1661, 605, 0.3f},
                };

            var result = new float[coords.Length][];
            var resultStr = "";
            var culture = new System.Globalization.CultureInfo("en-us");
            for (int i = 0; i < coords.Length; i++)
            {
                var coord = coords[i];
                result[i] = new float[3];
                result[i][1] = baseZ;
                result[i][2] = scaleX * (coord[1] - centerX);
                result[i][0] = scaleY * (coord[0] - centerY);
                resultStr += string.Format(culture, "new Light({0:0.0}f, {1:0.0}f, {2:0.0}f, {3:0.000}f), \r\n", result[i][0], result[i][1], result[i][2], coord[2]);
            }
            textBox1.Text = resultStr;
        }

        public void GenerateeLensCoordsZp()
        {
            float baseZ = 2048;
            float scaleX = 2.0f;
            float scaleY = 2.0f;
            float centerX = 1024;
            float centerY = 1024;

            var coords = new[]
                {
                    new[] {785, 1732, 0.3f},
                    new[] {821, 1283, 0.3f},
                    new[] {1493, 1487, 0.3f},
                    new[] {1757, 1214, 0.1f},
                };

            var result = new float[coords.Length][];
            var resultStr = "";
            var culture = new System.Globalization.CultureInfo("en-us");
            for (int i = 0; i < coords.Length; i++)
            {
                var coord = coords[i];
                result[i] = new float[3];
                result[i][1] = baseZ;
                result[i][2] = scaleX * (coord[1] - centerX);
                result[i][0] = scaleY * (coord[0] - centerY);
                resultStr += string.Format(culture, "new Light({0:0.0}f, {1:0.0}f, {2:0.0}f, {3:0.000}f), \r\n", result[i][0], result[i][1], result[i][2], coord[2]);
            }
            textBox1.Text = resultStr;
        }
        public Form1()
        {
            InitializeComponent();

            GenerateeLensCoordsZp();
            return;
            var result = "";
            var indices = "";
            var QuadsCount = 1;
            var Count = QuadsCount + 1;
            var step = 2.0 / QuadsCount;
            var i = 0;
            var culture = new System.Globalization.CultureInfo("en-us");
            var r = Math.Sqrt(3.0);
            culture.NumberFormat = new System.Globalization.NumberFormatInfo
            {
                NumberDecimalSeparator = ".",
                NumberGroupSeparator = ""
            };
            for (var x = -1.0; x < 1.0001; x+=step)
            {
                for (var y = -1.0; y < 1.0001; y += step)
                {
                    if ((i > Count) && (y > -0.9999))
                    {
                        indices += string.Format("{0:0}, ", i - Count - 1);
                        indices += string.Format("{0:0}, ", i - Count);
                        indices += string.Format("{0:0}, ", i);
                        indices += string.Format("{0:0}, ", i - Count - 1);
                        indices += string.Format("{0:0}, ", i);
                        indices += string.Format("{0:0}, \r\n", i - 1);
                    }

                    var l = Math.Sqrt(1 + x * x + y * y);
                    var z = 1.0;

                    var xx = x * r / l;
                    var yy = y * r / l;
                    z = z * r / l;
                    
                    //var tx = (x + 1.0) * 0.5;
                    //var ty = 1.0 - (y + 1.0) * 0.5;

                    var tx = (Math.Atan2(x, 1) * 4.0 / Math.PI + 1.0) * 0.5;
                    var ty = 1.0 - (Math.Atan2(y, 1) * 4.0 / Math.PI + 1.0) * 0.5; ;

                    z -= 1.0;
                    result += string.Format(culture, "{0:0.0000}, {1:0.0000}, {2:0.0000}, {3:0.0000}, {4:0.0000}, \r\n", xx, yy, z, tx, ty);
                    i++;
                }
            }
            textBox1.Text = result;
            textBox2.Text = indices;
        }
    }
}
